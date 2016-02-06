Option Strict On
Option Explicit On
Option Infer On

Imports Newtonsoft.Json
<Assembly: CLSCompliant(False)>

Class MainWindow
    ' Exception Handling
    Private Sub GlobalExceptionHandler(sender As Object, args As UnhandledExceptionEventArgs)
        Dim e As Exception = DirectCast(args.ExceptionObject, Exception)
        MessageBox.Show(e.Message, My.Application.Info.Title, MessageBoxButton.OK, MessageBoxImage.Error)
        Environment.Exit(0)
    End Sub

    Private Sub Window_Loaded(sender As Object, e As EventArgs) Handles Me.Loaded
        ' Global Exception Handling
        AddHandler AppDomain.CurrentDomain.UnhandledException, AddressOf GlobalExceptionHandler

        For Each Element In My.Resources.Elements.Split(CType(Environment.NewLine, Char()))
            If Element <> Nothing Then
                eleName.Items.Add(Element.Trim)
            End If
        Next

        ' Add Groups and Periods into Comboboxes
        For Group As Integer = 1 To 18
            eleGroup.Items.Add(Group)
        Next
        For Period As Integer = 1 To 9
            elePeriod.Items.Add(Period)
        Next
        eleGroup.Items.Add("")

        ' Add Element Classifications to Combobox
        Dim Types As Array = {"Non-Metal", "Alkali Metals", "Alkali Earths Metals", "Noble Gas", "Halogens", "Metalloids", "Transition Metals", "Post Transition Metals", "Lanthanides", "Actinides", "Other Metals"}
        eleClass.ItemsSource = Types

        ' Add Element Locations
        eleLocation.Items.Add("s-block")
        eleLocation.Items.Add("p-block")
        eleLocation.Items.Add("d-block")
        eleLocation.Items.Add("f-block")
        eleLocation.Items.Add("g-block")

        ' At Element States (At Room Temperature)
        eleState.Items.Add("Gas")
        eleState.Items.Add("Solid")
        eleState.Items.Add("Liquid")
        eleState.Items.Add("Unknown")
    End Sub
    Private Sub Window_ContentRendered(sender As Object, e As EventArgs) Handles Me.ContentRendered
        eleState.SelectedIndex = 0
        eleLocation.SelectedIndex = 0
        elePeriod.SelectedIndex = 0
        eleGroup.SelectedIndex = 0
        eleClass.SelectedIndex = 0
        eleName.SelectedIndex = 0
    End Sub

    Private Sub btnSave_Click(sender As Object, e As RoutedEventArgs) Handles btnSave.Click
        ' Read Edited Info into Element
        Dim SaveElement As New Element(eleSymbol.Text, eleName.Text, CInt(eleNum.Text), eleMass.Text, eleGroup.Text,
                                       CInt(elePeriod.Text), eleLocation.Text, eleClass.Text, eleShellConfig.Text,
                                       eleSubshellConfig.Text, eleIon.Text, eleState.Text, eleBoil.Text, eleMelt.Text,
                                      eleIsotope.Text, eleDiscovery.Text, eleDescription.Text)
        txtOutput.Text = SaveElement.GenerateSaveJSON

        ' Save File if Original File exists in Current Directory
        Dim FilePath As String = My.Application.Info.DirectoryPath & "\" & SaveElement.ReturnPartialFileName
        If System.IO.File.Exists(FilePath) = True Then
            My.Computer.FileSystem.WriteAllText(FilePath, txtOutput.Text, False)
            Exit Sub
        End If

        ' Open SaveFileDialog and Save if otherwise
        Dim filedialog As New Microsoft.Win32.SaveFileDialog
        filedialog.InitialDirectory = My.Application.Info.DirectoryPath
        filedialog.Title = "Locate Save Folder"
        filedialog.AddExtension = True
        filedialog.DefaultExt = ".json"
        filedialog.FileName = SaveElement.ReturnPartialFileName
        Select Case filedialog.ShowDialog
            Case Is = True
                If filedialog.FileName <> Nothing Then
                    My.Computer.FileSystem.WriteAllText(filedialog.FileName, txtOutput.Text, False)
                End If
        End Select
    End Sub

    Private Sub eleName_SelectionChanged(sender As Object, e As SelectionChangedEventArgs) Handles eleName.SelectionChanged
        ' Clear Textboxes and ComboBoxes
        Dim ElementComboBoxes As ComboBox() = {eleClass, eleLocation, eleState, eleGroup}
        Dim ElementTextBoxes As TextBox() = {eleNum, eleMass, eleShellConfig, eleSubshellConfig, eleIon, eleBoil, eleMelt, eleDiscovery, eleIsotope, eleDescription}
        For Each cmb As ComboBox In ElementComboBoxes : cmb.SelectedIndex = -1 : Next
        For Each txt As TextBox In ElementTextBoxes : txt.Text = Nothing : Next

        ' Get Element Number
        eleNum.Text = (eleName.SelectedIndex + 1).ToString(Globalization.CultureInfo.CurrentCulture)

        ' Attempt to read corresponding JSON file - If it's in same folder
        Dim FilePath As String = My.Application.Info.DirectoryPath & String.Format(Globalization.CultureInfo.CurrentCulture, "\Element_{0:000}.json", eleName.SelectedIndex + 1)
        If System.IO.File.Exists(FilePath) = True Then
            LoadElement(FilePath)
        End If
    End Sub

    Private Sub btnEdit_Click(sender As Object, e As RoutedEventArgs) Handles btnEdit.Click
        ' Ask user to select file
        Dim filedialog As New Microsoft.Win32.OpenFileDialog
        filedialog.Title = "Locate File"
        If filedialog.ShowDialog = True Then
            If filedialog.FileName <> Nothing Then
                LoadElement(filedialog.FileName)
            End If
        End If
    End Sub

    Public Sub LoadAndResave() Handles btnLoadAndResave.Click
        For i = 0 To eleName.Items.Count
            eleName.SelectedIndex = i + 1
            btnSave_Click(btnSave, Nothing)
        Next
    End Sub

    Public Sub LoadElement(file As String)
        ' Check to ensure that file is not empty
        Dim ElementFile As String = My.Computer.FileSystem.ReadAllText(file)
        If ElementFile = Nothing Then
            Exit Sub
        End If

        ' Read into Element
        Dim Element As Element = JsonConvert.DeserializeObject(Of Element)(ElementFile)

        eleName.Text = Element.Name
        eleClass.Text = Element.ElementClass
        If Element.Mass IsNot Nothing Then
            eleMass.Text = Element.Mass.ToString
        End If
        eleSymbol.Text = Element.Symbol

        eleLocation.Text = Element.Location

        eleShellConfig.Text = Element.ShellConfig
        eleSubshellConfig.Text = Element.SubshellConfig

        eleIon.Text = Element.Ionisation
        eleState.Text = Element.State

        eleBoil.Text = Element.BoilingPoint
        eleMelt.Text = Element.MeltingPoint

        eleIsotope.Text = Element.Isotopes
        eleDiscovery.Text = Element.Discovery
        eleDescription.Text = Element.Description

        If Element.Group IsNot Nothing Then
            eleGroup.Text = Element.Group.ToString
        Else
            eleGroup.SelectedIndex = eleGroup.Items.Count - 1
        End If
        elePeriod.Text = Element.Period.ToString(Globalization.CultureInfo.CurrentCulture)
    End Sub
End Class

Public Class Element
    Sub New(symbol As String, name As String, atomicNumber As Integer, mass As String, group As String, period As Integer, location As String, type As String,
            shellConfig As String, subshellConfig As String, ionisation As String, state As String, boilingPoint As String, meltingPoint As String,
            isotopes As String, discovery As String, description As String)
        _Symbol = symbol
        _Name = name
        _Number = atomicNumber
        _Mass = mass
        _Group = group
        _Period = period
        _Location = location
        _ElementClass = type
        _ShellConfig = shellConfig
        _SubshellConfig = subshellConfig
        _Ionisation = ionisation
        _State = state
        _BoilingPoint = boilingPoint
        _MeltingPoint = meltingPoint
        _Isotopes = isotopes
        _Discovery = discovery
        _Description = description
    End Sub

    Dim _Symbol As String = ""
    Property Symbol As String
        Get
            Return _Symbol
        End Get
        Set(value As String)
            _Symbol = value
        End Set
    End Property

    Dim _Number As Integer = 0
    <JsonProperty("Atomic Number")>
    Property Number As Integer
        Get
            Return _Number
        End Get
        Set(value As Integer)
            _Number = value
        End Set
    End Property

    Dim _Name As String = ""
    Property Name As String
        Get
            Return _Name
        End Get
        Set(value As String)
            _Name = value
        End Set
    End Property

    Dim _Mass As String = ""
    Property Mass As String
        Get
            If _Mass = Nothing Then
                Return Nothing
            ElseIf _Mass.ToString.Trim = "" Then
                Return Nothing
            Else
                Return _Mass
            End If
        End Get
        Set(value As String)
            If value IsNot Nothing Then
                _Mass = value.ToString
            End If
        End Set
    End Property

    Dim _Group As String = ""
    Property Group As Object
        Get
            Dim ElementGroup As Integer = 0
            Dim r As Boolean = Integer.TryParse(_Group, ElementGroup)
            If r = True Then
                Return ElementGroup
            ElseIf _Group = Nothing Then
                Return Nothing
            ElseIf _Group.ToString.Trim = "" Then
                Return nothing
            Else
                Return _Group
            End If
        End Get
        Set(value As Object)
            If value IsNot Nothing Then
                _Group = value.ToString
            End If
        End Set
    End Property

    Dim _Period As Integer = 0
    Property Period As Integer
        Get
            Return _Period
        End Get
        Set(value As Integer)
            _Period = value
        End Set
    End Property

    Dim _ElementClass As String = ""
    <JsonProperty("Classification")>
    Property ElementClass As String
        Get
            Return _ElementClass
        End Get
        Set(value As String)
            _ElementClass = value
        End Set
    End Property

    Dim _Location As String = ""
    Property Location As String
        Get
            Return _Location
        End Get
        Set(value As String)
            _Location = value
        End Set
    End Property

    Dim _ShellConfig As String = ""
    <JsonProperty("Electron shell configuration")>
    Property ShellConfig As String
        Get
            Return _ShellConfig
        End Get
        Set(value As String)
            _ShellConfig = value
        End Set
    End Property

    Dim _SubshellConfig As String = ""
    <JsonProperty("Electron subshell configuration")>
    Property SubshellConfig As String
        Get
            Return _SubshellConfig
        End Get
        Set(value As String)
            _SubshellConfig = value
        End Set
    End Property

    Dim _Ionisation As String = ""
    <JsonProperty("Ionisation energy")>
    Property Ionisation As String
        Get
            Return _Ionisation
        End Get
        Set(value As String)
            _Ionisation = value
        End Set
    End Property

    Dim _State As String = ""
    <JsonProperty("State at Room Temperature")>
    Property State As String
        Get
            Return _State
        End Get
        Set(value As String)
            _State = value
        End Set
    End Property

    Dim _BoilingPoint As String = ""
    <JsonProperty("Boiling Point")>
    Property BoilingPoint As String
        Get
            Return _BoilingPoint
        End Get
        Set(value As String)
            _BoilingPoint = value
        End Set
    End Property

    Dim _MeltingPoint As String = ""
    <JsonProperty("Melting Point")>
    Property MeltingPoint As String
        Get
            Return _MeltingPoint
        End Get
        Set(value As String)
            _MeltingPoint = value
        End Set
    End Property

    Dim _Isotopes As String = ""
    Property Isotopes As String
        Get
            Return _Isotopes
        End Get
        Set(value As String)
            _Isotopes = value
        End Set
    End Property

    Dim _Discovery As String = ""
    <JsonProperty("Discovered")>
    Property Discovery As String
        Get
            Return _Discovery
        End Get
        Set(value As String)
            _Discovery = value
        End Set
    End Property

    Dim _Description As String = ""
    <JsonProperty("Element Description")>
    Property Description As String
        Get
            Return _Description
        End Get
        Set(value As String)
            _Description = value
        End Set
    End Property

    ' Save/Overwrite File in Current Directory
    Sub Save()
        Dim ElementJSON As String = GenerateSaveJSON()
        My.Computer.FileSystem.WriteAllText(ReturnPartialFileName, ElementJSON, False)
    End Sub

    ' Generate JSON for Saving
    Function GenerateSaveJson() As String
        Return JsonConvert.SerializeObject(Me, Formatting.Indented)
    End Function

    ' Return Save Filename
    Function ReturnPartialFileName() As String
        Return String.Format(Globalization.CultureInfo.CurrentCulture, "Element_{0:000}.json", Number)
    End Function
End Class